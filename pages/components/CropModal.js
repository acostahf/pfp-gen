import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
// import styles from "../../styles/Home.module.css";
import styled from "styled-components";

const CropModal = ({ imageUrl }) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	// const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
	// const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
	// 	setCroppedAreaPixels(croppedAreaPixels);
	// }, []);
	const [croppedArea, setCroppedArea] = useState(null);

	// const showCroppedImage = useCallback(async () => {
	// 	try {
	// 		const croppedImage = await getCroppedImg(croppedAreaPixels);
	// 		setCroppedImage(croppedImage);
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// }, [croppedAreaPixels]);

	const CROP_AREA_ASPECT = 1 / 1;

	const Output = ({ croppedArea }) => {
		const scale = 100 / croppedArea.width;
		const transform = {
			x: `${-croppedArea.x * scale}%`,
			y: `${-croppedArea.y * scale}%`,
			scale,
			width: "calc(100% + 0.5px)",
			height: "auto",
		};

		const imageStyle = {
			transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
			width: transform.width,
			height: transform.height,
		};

		return (
			<ImageWrapper style={{ paddingBottom: `${30 / CROP_AREA_ASPECT}%` }}>
				<Img src={imageUrl} alt="" style={imageStyle} />
			</ImageWrapper>
		);
	};

	return (
		<Container>
			<CropperWrapper>
				<Cropper
					image={imageUrl}
					aspect={CROP_AREA_ASPECT}
					crop={crop}
					zoom={zoom}
					onCropChange={setCrop}
					onZoomChange={setZoom}
					onCropAreaChange={(croppedImage) => {
						console.log(croppedArea);
						setCroppedArea(croppedImage);
					}}
				/>
				{/* <ImgDialog img={croppedImage} onClose={onClose} /> */}
			</CropperWrapper>
			<Viewer>{croppedArea && <Output croppedArea={croppedArea} />}</Viewer>
			{/* <button className={styles.button} onClick={showCroppedArea}>
				show{" "}
			</button> */}
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	text-align: center;
	display: flex;
	flex-direction: column;
`;

const CropperWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 50vh;
`;

const ImageWrapper = styled.div`
	position: relative;
	width: 300px;
	overflow: hidden;
	box-shadow: 0 0 32px rgba(0, 0, 0, 0.3);
`;
const Img = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: top left;
`;

const Viewer = styled.div`
	position: relative;
	width: 100%;
	/* height: 50vh; */
	display: flex;
	/* align-items: center; */
	justify-content: center;
`;

export default CropModal;
