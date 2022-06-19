import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useMoralis } from "react-moralis";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useMoralisWeb3Api } from "react-moralis";
import Cropper from "react-easy-crop";
import CropModal from "./components/CropModal";

export default function Home() {
	const [nfts, setNfts] = useState([]);
	const { isAuthenticated, authenticate, account, user, logout } = useMoralis();
	const [selectedImage, setSelectedImage] = useState(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		console.log(croppedArea, croppedAreaPixels);
	}, []);

	const Web3Api = useMoralisWeb3Api();

	const fetchNFTsForContract = async () => {
		// console.log(Web3Api.account);
		const options = {
			chain: "eth",
			address: account,
			token_address: "0xac9db91e958d418bf83781ecadf0431601c48193",
		};
		const kumiteNFTs = await Web3Api.account.getNFTsForContract(options);
		console.log(kumiteNFTs);
		setNfts(kumiteNFTs.result);
	};
	useEffect(() => {
		if (isAuthenticated) {
			fetchNFTsForContract();
			// console.log(nfts);
		}
	}, [isAuthenticated]);

	return (
		<div className={styles.container}>
			<Head>
				<title>PFP Generator</title>
				<meta name="description" content="Web3 app to crop NFT images for a profile picture" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{selectedImage ? <CropModal imageUrl={selectedImage} /> : null}
				<h1 className={styles.title}>Welcome to the PFP Generator</h1>

				<p className={styles.description}>Connect Wallet to get started</p>

				<button
					onClick={() => {
						authenticate({ signingMessage: "Auth linking of your wallet" });
					}}
				>
					Login with Metamask
				</button>

				<button
					onClick={() => {
						logout();
					}}
				>
					Logout
				</button>

				{isAuthenticated ? (
					<>
						{nfts.map((nft, i) => (
							<img
								key={i}
								src={`https://night-owls-genesis-nft.s3.us-west-2.amazonaws.com/images/${nft.token_id}.png`}
								alt={"nft image"}
								width={350}
								height={350}
								onClick={() => setSelectedImage(`https://night-owls-genesis-nft.s3.us-west-2.amazonaws.com/images/${nft.token_id}.png`)}
							/>
						))}
					</>
				) : (
					"not connected"
				)}
			</main>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by{" "}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	);
}
