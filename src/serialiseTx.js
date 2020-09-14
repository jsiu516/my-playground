  /**
   * Returns the protobuf representation of the current transaction in order for it to be signed
   * @return {!Uint8Array}
   */
const pb = require('./google-protobuf');
function prepareForSigningProto(txData) {
    let tpb = new pb.Transaction;

    tpb.setNonce(txData.nonce)
    tpb.setValue(toErdBigInt(txData.value))
    tpb.setRcvaddr(Buffer.from(txData.receiver, 'hex'));
    tpb.setSndaddr(Buffer.from(txData.sender, 'hex'));

    // The following properties which are optional are added only if they are set up
    if (txData.gasPrice) {
      tpb.setGasprice(txData.gasPrice);
    }
    if (txData.gasLimit) {
      tpb.setGaslimit(txData.gasLimit);
    }
    // if (txData.data) {
    //   tpb.setData(txData.data);
    // }
    tpb.setChainId(txData.chainID);
    tpb.setVersion(txData.version)
    tpb.setSignature(txData.signature)
    //tpb.toObject()

    const serialisedTx = tpb.serializeBinary()
    console.log(tpb)
    return serialisedTx;
  }

  function toErdBigInt(value) {
    // Format  <sign><absolute value>
    // Where <sign> one byte (0 for positive, 1 for negative)
    //       <absolute value> any number of bytes representing
    //                        the absolute value (bigendian)
    let zero = Buffer.from('0000', 'hex')
    if(!Number.isInteger(value)) {
      return zero
    }

    if (value === 0) {
      return zero
    }
    let sign = '00'

    if (value < 0) {
      sign = '01'
      value = value * -1
    }
    let abs = ''
    while (value > 0) {
      let b = value & 0xff
      abs = ('0' + b.toString(16)).slice(-2) + abs
      value = value >> 8
    }
    return Buffer.from( sign + abs, 'hex')
  }

 function prepareForSigning(txData) {
    let mainTx = {
      nonce: txData.nonce,
      value: toErdBigInt(txData.value),
      // We encode sender and receiver as base64 for signing to match the go's implementation
      receiver: Buffer.from(txData.receiver, 'hex').toString('base64'),
      sender: Buffer.from(txData.sender, 'hex').toString('base64'),
    };

    // The following properties which are optional are added only if they are set up
    if ( txData.gasPrice ) {
      mainTx.gasPrice = txData.gasPrice;
    }
    if ( txData.gasLimit ) {
      mainTx.gasLimit = txData.gasLimit;
    }
    mainTx.chainID = Buffer.from(txData.chainID, 'hex').toString('base64')
    mainTx.version = txData.version
    mainTx.signature = Buffer.from(txData.signature, 'hex').toString('base64')
    return Buffer.from(JSON.stringify(mainTx));
  }

function hash(input2) {
  console.log('blake2b:', blake2b(output.length).update(input2).digest('hex'))
  console.log("blakejs", blake.blake2sHex(input2))
  let blake256 = cry.blake2b256(input2)
  blake256.toString('hex');
  createBlakeHash('blake256').digest().toString('hex')
  console.log("blackhash", createBlakeHash('blake256').update(input2).digest('hex'))
  console.log("expected: 95fca6d3d7d96ac0f8d6ce5088110d43e1f84e56eb89781ddc3fe6af9f75f8e5")
}
  
var signedTransaction = {
    "nonce": 8,
    "value": "1000000000000000000",
    "receiver": "erd1rtckak8zfmdu39xwjr9lv56x38lef9yna4ae62252lc6uwlu2r3s28r9qk",
    "sender": "erd1lcweyvdg9n4wjlyy77vmd395j3evrw26q4cxcjgtshvjmpt4waqq3dk0jt",
    "gasPrice": 1000000000,
    "gasLimit": 50000,
    "data": "",
    "chainID": "T",
    "version": 1,
    "signature": "ca071d3791f6c626637612323b7d825cb1c8a7c1abf300f6df891f7b361dbf4bf6c02dc0bdadbc8b46342dff40b216abd5b93d9c95221f949313139048dcf301"
}

var signedTransaction2 = {
    "Nonce": 9,
    "Value": "1000000000000000000",
    "RcvAddr": "erd1rtckak8zfmdu39xwjr9lv56x38lef9yna4ae62252lc6uwlu2r3s28r9qk",
    "SndAddr": "erd1lcweyvdg9n4wjlyy77vmd395j3evrw26q4cxcjgtshvjmpt4waqq3dk0jt",
    "GasPrice": 1000000000,
    "GasLimit": 50000,
    "Signature": "a8d9e0188990e75c2d429e98f46cb36d2d8dac668acf74607705a926eb83f1c7f575220bb867c5702246bcde9c1382fdd8bddea5aa79a3347a49463f734f4801",
    "ChainID": "T",
    "Version": 1,
}

const serialisedTx = prepareForSigningProto(signedTransaction);
const serialisedTx2 = prepareForSigning(signedTransaction);

function toHexString(byteArray) {
  return byteArray.reduce((output, elem) =>
    (output + "0x" + ('0' + elem.toString(16)).slice(-2) + ", "),
    ' ');
}
//const fullTx = new transaction(1, senderAcc.publicKeyAsString(), receiver, 0xabcdef, 2, 3, "data");


const createBlakeHash = require('blake-hash')
var blake2b = require('blake2b')
var blake = require('blakejs')
var {
    cry,
    abi,
    RLP,
    Transaction,
    Certificate,
    Bloom
} = require('blcf-devkit')

var output = new Uint8Array(32)
console.log(Buffer.from(serialisedTx).toString('hex'))
var input = Buffer.from(serialisedTx);
var input2 = Buffer.from(JSON.stringify(signedTransaction))
hash(input)
hash(toHexString(serialisedTx))
// hash(serialisedTx2)
// hash(input2)


