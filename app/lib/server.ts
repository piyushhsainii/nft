export const runtime = "nodejs";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58";
export async function createNFT() {
  try {
    console.log("Starting process...");
    //  STEP 1 - Installation and Settin up UMI Instance
    const umi = createUmi(clusterApiUrl("devnet"));
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    // converting to umi compatible keypair
    // const user = await Keypair.generate();
    const pubKey = "5NHvrqoZk4ov5GvKzDpsmEeW4URwLuG6P4HrmSDTqHc7";
    const privkey = process.env.SECRET_KEY!;
    const secKey = bs58.decode(privkey);
    const umiUser = umi.eddsa.createKeypairFromSecretKey(secKey);
    // create a generic file
    umi.use(keypairIdentity(umiUser)).use(mplTokenMetadata());
    const file = createGenericFile("", "");
    // upload the image to native
    // const [image] = await umi.uploader.upload([file])
    // uploading JSON
    // const metadataUri = await umi.uploader.uploadJson({
    //     name:"",
    //     description:"",
    //     image:image
    // })
    const uri =
      "https://res.cloudinary.com/dzow59kgu/raw/upload/v1754307588/testMetadata_ucumla.json";
    // upload it to umi uploader json
    const mint = generateSigner(umi);
    // CREATING THE NFT
    const { result, signature } = await createNft(umi, {
      mint,
      name: "Jacked Nerd",
      sellerFeeBasisPoints: percentAmount(1),
      uri,
      isCollection: true,
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });
    console.log("Created Collection successfully");
    const createdDigitalAsset = await fetchDigitalAsset(umi, mint.publicKey, {
      commitment: "confirmed",
    });
    return createdDigitalAsset.mint.publicKey;
  } catch (error) {
    console.log(error);
    return null;
  }
}
