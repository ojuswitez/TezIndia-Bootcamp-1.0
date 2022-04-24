import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const Tezos = new TezosToolkit('https://ithacanet.ecadinfra.com');

const contractAddress: string = 'KT1M5yks9wb8UehAFrj9noexAUReuzAtDvZj';

const FAUCET = {
    "pkh": "tz1Q5Xw6YKdrtYjQzbrEZKtXeiZVMRFPNWfj",
    "mnemonic": [
        "gorilla",
        "drift",
        "creek",
        "joy",
        "enter",
        "rifle",
        "junk",
        "safe",
        "diary",
        "ginger",
        "must",
        "unfair",
        "still",
        "mad",
        "danger"
    ],
    "email": "zwklfwyv.jwpnbxht@teztnets.xyz",
    "password": "cG4z6n86gf",
    "amount": "36772225314",
    "activation_code": "51f50e8a7f125ac6fe7bc7f09dfcc8b6cb881b08"
}

importKey(
    Tezos,
    FAUCET.email,
    FAUCET.password,
    FAUCET.mnemonic.join(' '),
    FAUCET.activation_code
).catch((e) => console.error(e));


const getStorage = async () => {
    const contract = await Tezos.contract.at(contractAddress);
    const storage = await contract.storage();
    console.log(storage);
    return storage
}

const transferAmount = async () => {
    const amount = 2;
    const address = 'tz1bb299QQuWXuYbynKzPfdVftmZdAQrvrGN'
    console.log(`Transfering ${amount} ꜩ to ${address}...`);
    Tezos.contract
        .transfer({ to: address, amount: amount })
        .then((op) => {
            console.log(`Waiting for ${op.hash} to be confirmed...`);
            return op.confirmation(1).then(() => op.hash);
        })
        .then((hash) => console.log(`Operation injected: https://ithaca.tzstats.com/${hash}`))
        .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
}

const vote = async (option: string) => {
    const contract = await Tezos.contract.at(contractAddress);
    const opHash = await contract.methods.vote(option).send();
    console.log(`Waiting for ${opHash.hash} to be confirmed...`);
    const confirmation = await opHash.confirmation(1);
    console.log(`Operation injected: https://ithacanet.tzkt.io/${opHash.hash}`);
    return confirmation;
}

const main = async () => {
    const transfer = await transferAmount();
    const storage = await getStorage();
    const voting = await vote("yes");
}

try {
    main();
}
catch (e) {
    console.error(e);
}