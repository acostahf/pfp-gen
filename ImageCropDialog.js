import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import styled from "styled-components";

const aspectRatios = [
	{ value: 4 / 3, text: "4/3" },
	{ value: 16 / 9, text: "16/9" },
	{ value: 1, text: "1" },
];

const ImageCropDialog = ({ id, imageUrl, cropInit, zoomInit, aspectInit, onCancel, setCroppedImageFor, resetImage }) => {
	if (zoomInit == null) {
		zoomInit = 1;
	}
	if (cropInit == null) {
		cropInit = { x: 0, y: 0 };
	}
	if (aspectInit == null) {
		aspectInit = aspectRatios[0];
	}
	const [zoom, setZoom] = useState(zoomInit);
	const [crop, setCrop] = useState(cropInit);
	const [aspect, setAspect] = useState(aspectInit);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

	const onCropChange = (crop) => {
		setCrop(crop);
	};

	const onZoomChange = (zoom) => {
		setZoom(zoom);
	};

	const onAspectChange = (e) => {
		const value = e.target.value;
		const ratio = aspectRatios.find((ratio) => ratio.value == value);
		setAspect(ratio);
	};

	const onCropComplete = (croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const onCrop = async () => {
		const croppedImageUrl = await getCroppedImg(imageUrl, croppedAreaPixels);
		setCroppedImageFor(id, crop, zoom, aspect, croppedImageUrl);
	};

	const onResetImage = () => {
		resetImage(id);
	};

	return (
		<div>
			<Backdrop></Backdrop>
			<CropContainer>
				<Cropper
					image={imageUrl}
					zoom={zoom}
					crop={crop}
					aspect={1}
					onCropChange={onCropChange}
					onZoomChange={onZoomChange}
					onCropComplete={onCropComplete}
				/>
				<Controls>
					<ButtonArea>
						<button onClick={onCancel}>Cancel</button>
						<button onClick={onResetImage}>Reset</button>
						<button onClick={onCrop}>Download</button>
					</ButtonArea>
				</Controls>
			</CropContainer>
		</div>
	);
};

const Backdrop = styled.div`
	position: fixed;
	background-color: black;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;
const CropContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 80px;
`;
const ButtonArea = styled.div`
	text-align: center;
	margin-top: 20px;
`;
const Controls = styled.div`
	position: fixed;
	bottom: 0px;
	width: 100%;
	height: 80px;
`;

export default ImageCropDialog;
