import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import styled from "styled-components";
import { useMoralis } from "react-moralis";
import { useEffect, useState, useCallback } from "react";
import ImageCropDialog from "../ImageCropDialog";
import { useMoralisWeb3Api } from "react-moralis";

export default function Home() {
	const { isAuthenticated, authenticate, account, user, logout } = useMoralis();
	const [nfts, setNfts] = useState([]);
	const [selectedNft, setSelectedNft] = useState(null);

	const Web3Api = useMoralisWeb3Api();

	const fetchNFTsForContract = async () => {
		// console.log(Web3Api.account);
		const options = {
			chain: "eth",
			address: account,
			token_address: "0xAAE22935aB089Ca7CBAe330Eed96DBef8dBC900a",
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

	const setCroppedImageFor = (id, crop, zoom, aspect, croppedImageUrl) => {
		const newNftsList = [...nfts];
		const nftIndex = nfts.findIndex((x) => x.id === id);
		const nft = nfts[nftIndex];
		const newnft = { ...nft, croppedImageUrl, crop, zoom, aspect };
		newNftsList[nftIndex] = newnft;
		setNfts(newNftsList);
		setSelectedNft(null);
	};

	const onCancel = () => {
		setSelectedNft(null);
	};

	const resetImage = (id) => {
		setCroppedImageFor(id);
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>PFP Generator</title>
				<meta name="description" content="Web3 app to crop NFT images for a profile picture" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				{/* {selectedImage ? <CropModal imageUrl={selectedImage} /> : null} */}
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
						{selectedNft ? (
							<ImageCropDialog
								id={selectedNft.id}
								imageUrl={`https://opensea.mypinata.cloud/ipfs/QmXLSFruqS2iZJYXghaZ5mq9TXswd97iXKcGWLcz4GWAqt`}
								cropInit={selectedNft.crop}
								zoomInit={selectedNft.zoom}
								aspectInit={selectedNft.aspect}
								onCancel={onCancel}
								setCroppedImageFor={setCroppedImageFor}
								resetImage={resetImage}
							/>
						) : null}
						{nfts.map((nft) => (
							<ImageCard key={nft.id}>
								<img
									src={
										nft.croppedImageUrl ? nft.croppedImageUrl : `https://opensea.mypinata.cloud/ipfs/QmXLSFruqS2iZJYXghaZ5mq9TXswd97iXKcGWLcz4GWAqt`
									}
									alt=""
									onClick={() => {
										console.log(nft);
										setSelectedNft(nft);
									}}
								/>
							</ImageCard>
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

const ImageCard = styled.div`
	text-align: center;
	& img {
		width: 600px;
	}
`;
