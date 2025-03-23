import util from './helpers'
import SignalProtocolStore from './InMemorySignalProtocolStore.js'
import axios from "axios";
import { storePrekeyBundle } from '../utils/APIRoutes.js';
import { getPrekeyBundle } from '../utils/APIRoutes.js';
import { storeIdentityKeyPair } from '../utils/APIRoutes.js';
import { getIdentityKeyPair } from '../utils/APIRoutes.js';

const libsignal = window.libsignal
/**
 * Dummy signal server connector.
 * 
 * In a real application this component would connect to your signal
 * server for storing and fetching user public keys over HTTP.
 */
export class SignalServerStore {
    // constructor() {
    //     this.store = {};
    // }

    /**
     * When a user logs on they should generate their keys and then register them with the server.
     * 
     * @param userId The user ID.
     * @param preKeyBundle The user's generated pre-key bundle.
     */
    async registerNewPreKeyBundle(userId, preKeyBundle) {
        console.log("registerNewPreKeyBundle");
        console.log(userId);

        try {
            // swap variable that are arraybuffer33 to string
            // for storing process...
            let stringfiedPreKeyBundle = { ...preKeyBundle }
            stringfiedPreKeyBundle.identityKey = util.toString(stringfiedPreKeyBundle.identityKey)
            stringfiedPreKeyBundle.preKey.publicKey = util.toString(stringfiedPreKeyBundle.preKey.publicKey)
            stringfiedPreKeyBundle.signedPreKey.publicKey = util.toString(stringfiedPreKeyBundle.signedPreKey.publicKey)
            stringfiedPreKeyBundle.signedPreKey.signature = util.toString(stringfiedPreKeyBundle.signedPreKey.signature)

            // Store the pre-key bundle on the server or backend
            await axios.post(`${storePrekeyBundle}/${userId}`, {
                userId: userId,
                preKeyBundle: stringfiedPreKeyBundle,
            });
        } catch (error) {
            console.error('Error fetching pre-key bundle:', error);
            throw error;
        }
    }

    /**
     * Gets the pre-key bundle for the given user ID.
     * If you want to start a conversation with a user, you need to fetch their pre-key bundle first.
     * 
     * @param userId The ID of the user.
     */
    async getPreKeyBundle(userId) {
        console.log("getPreKeyBundle");

        try {
            // swap variable that are string to arraybufer33
            // for storing process...
            // Fetch the pre-key bundle from the server/backend
            const response = await axios.get(`${getPrekeyBundle}?userId=${userId}`);
            // let storageBundle = JSON.parse(response.data.storageBundle);
            console.log(response.data.preKeyBundle);

            let arryedPreKeyBundle = response.data.preKeyBundle;

            arryedPreKeyBundle.identityKey = util.toArrayBuffer(arryedPreKeyBundle.identityKey);
            arryedPreKeyBundle.preKey.publicKey = util.toArrayBuffer(arryedPreKeyBundle.preKey.publicKey);
            arryedPreKeyBundle.signedPreKey.publicKey = util.toArrayBuffer(arryedPreKeyBundle.signedPreKey.publicKey);
            arryedPreKeyBundle.signedPreKey.signature = util.toArrayBuffer(arryedPreKeyBundle.signedPreKey.signature);
           
            console.log(arryedPreKeyBundle);

            return arryedPreKeyBundle;

        } catch (error) {
            console.error('Error fetching pre-key bundle:', error);
            throw error;
        }

    }
}

/**
 * A signal protocol manager.
 */
 class SignalProtocolManager {
    constructor(userId, signalServerStore) {
        this.userId = userId;
        this.store = new SignalProtocolStore();
        this.signalServerStore = signalServerStore;
    }

    /**
     * Initialize the manager when the user logs on.
     */
    async initializeAsync() {
        console.log("initialize Async...", this.userId)

        // Check if user has an identity key
        // const { identityKey, registrationId } = await this._getIdentityKeyPair(this.userId);

        // if (identityKey) {
        //     // Put the existing identityKey and registrationId in the store
        //     this.store.put('identityKey', identityKey);
        //     this.store.put('registrationId', registrationId);
        // } else {
            // Generate a new identity
            await this._generateIdentityAsync();
        // }

        // Generate the pre-key bundle
        var preKeyBundle = await this._generatePreKeyBundleAsync(123, 456);
        await this.signalServerStore.registerNewPreKeyBundle(this.userId, preKeyBundle);
    }

    /**
     * Encrypt a message for a given user.
     * 
     * @param remoteUserId The recipient user ID.
     * @param message The message to send.
     */
    async encryptMessageAsync(remoteUserId, message) {
        var sessionCipher = this.store.loadSessionCipher(remoteUserId);
        console.log("encrypting...");
        console.log("remoteUserId: ", remoteUserId);

        if (sessionCipher == null) {
            console.log("Creating new session...");

            var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
            var sessionBuilder = new libsignal.SessionBuilder(this.store, address);

            var remoteUserPreKey = await this.signalServerStore.getPreKeyBundle(remoteUserId);
            await sessionBuilder.processPreKey(remoteUserPreKey);

            var sessionCipher = new libsignal.SessionCipher(this.store, address);
            await this.store.storeSessionCipher(remoteUserId, sessionCipher);
        }

        var cipherText = await sessionCipher.encrypt(util.toArrayBuffer(message));

        return cipherText;
    }

    /**
     * Decrypts a message from a given user.
     * 
     * @param remoteUserId The user ID of the message sender.
     * @param cipherText The encrypted message bundle. (This includes the encrypted message itself and accompanying metadata)
     * @returns The decrypted message string.
     */
    async decryptMessageAsync(remoteUserId, cipherText) {
        console.log("decrypting...");
        console.log("remoteUserId: ", remoteUserId);
        console.log("bundle exist: ", remoteUserId);
        console.log("Pre key bundle...", await this.store.getIdentityKeyPair());

        var sessionCipher = this.store.loadSessionCipher(remoteUserId);

        if (sessionCipher == null) {

            var address = new libsignal.SignalProtocolAddress(remoteUserId, 123);
            var sessionCipher = new libsignal.SessionCipher(this.store, address);
            this.store.storeSessionCipher(remoteUserId, sessionCipher);
        }

        var messageHasEmbeddedPreKeyBundle = cipherText.type == 3;

      
        if (messageHasEmbeddedPreKeyBundle) {
            console.log("messageHasEmbeddedPreKeyBundle...");

            var decryptedMessage = await sessionCipher.decryptPreKeyWhisperMessage(cipherText.body, 'binary');
            return util.toString(decryptedMessage);
        } else {
            console.log("NO messageHasEmbeddedPreKeyBundle...");

            var decryptedMessage = await sessionCipher.decryptWhisperMessage(cipherText.body, 'binary');
            return util.toString(decryptedMessage);
        }
     } 
    

    async _getIdentityKeyPair(userId) {
        try {
            const response = await axios.get(`${getIdentityKeyPair}?userId=${userId}`);

            if (response.data && response.data.data) {
                const { identityKey, registrationId } = response.data.data;
                return {
                    identityKey: {
                        pubKey: util.toArrayBuffer(identityKey.pubKey),
                        privKey: util.toArrayBuffer(identityKey.privKey)
                    },
                    registrationId
                };
            } else {
                return { identityKey: null, registrationId: null };
            }
        } catch (error) {
            console.error('Error fetching identity key pair:', error);
            return { identityKey: null, registrationId: null };
        }
    }

    /**
     * Generates a new identity for the local user.
     */
    async _generateIdentityAsync() {
        var results = await Promise.all([
            libsignal.KeyHelper.generateIdentityKeyPair(),
            libsignal.KeyHelper.generateRegistrationId(),
        ]);
        
        const identityKey = results[0];
        const registrationId = results[1];

        // await axios.post(`${storeIdentityKeyPair}`, {
        //     userId: this.userId,
        //     identityKey: {
        //         pubKey: util.toString(identityKey.pubKey),
        //         privKey: util.toString(identityKey.privKey)
        //     },
        //     registrationId: registrationId,
        // });

        
        this.store.put('identityKey', identityKey);
        this.store.put('registrationId', registrationId);
    }

    /**
     * Generates a new pre-key bundle for the local user.
     * 
     * @param preKeyId An ID for the pre-key.
     * @param signedPreKeyId An ID for the signed pre-key.
     * @returns A pre-key bundle.
     */
    async _generatePreKeyBundleAsync(preKeyId, signedPreKeyId) {
        var result = await Promise.all([
            this.store.getIdentityKeyPair(),
            this.store.getLocalRegistrationId()
        ]);

        let identity = result[0];
        let registrationId = result[1];

        var keys = await Promise.all([
            libsignal.KeyHelper.generatePreKey(preKeyId),
            libsignal.KeyHelper.generateSignedPreKey(identity, signedPreKeyId),
        ]);

        let preKey = keys[0]
        let signedPreKey = keys[1];

        this.store.storePreKey(preKeyId, preKey.keyPair);
        this.store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

        return {
            identityKey: identity.pubKey,
            registrationId: registrationId,
            preKey: {
                keyId: preKeyId,
                publicKey: preKey.keyPair.pubKey
            },
            signedPreKey: {
                keyId: signedPreKeyId,
                publicKey: signedPreKey.keyPair.pubKey,
                signature: signedPreKey.signature
            }
        };
    }
}

export async function createSignalProtocolManager(userId, dummySignalServer) {
    let signalProtocolManagerUser = new SignalProtocolManager(userId, dummySignalServer);
    await Promise.all([
        signalProtocolManagerUser.initializeAsync(),
    ]);
    return signalProtocolManagerUser
}