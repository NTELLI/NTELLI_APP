import React, { useState } from "react";
import { Modal, Input, Button, Text } from "@nextui-org/react";
import { useRealm } from "@/context/RealmProvider";
import { getUserData, updateApiKeyAndOrgID } from "@/utils/mongodb/mongodb";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import useWindowWidth from "@/hooks/useWindowWidth";

export default function ModalApiKey() {
	const { app } = useRealm();
	const [visible, setVisible] = useState(false);
	const [apiKeyText, setApiKeyText] = useState("");
	const [orgID, setOrgID] = useState("");

	const windowWidth = useWindowWidth();
	const mobileWidth = windowWidth <= 560;

	const checkForOpenAiSettings = async () => {
		const openaiApiKey = getUserData(app);
		const result = await openaiApiKey;
		setApiKeyText(result.openai_apiKey);
		setOrgID(result.openai_organization_id);
	};
	const updateDocument = () => {
		updateApiKeyAndOrgID(app, apiKeyText, orgID);
		closeHandler();
	};

	const handler = () => {
		checkForOpenAiSettings();
		setVisible(true);
	};

	const closeHandler = () => {
		setVisible(false);
	};

	const apiKeySetter = (event: React.ChangeEvent<any>) => {
		setApiKeyText(event.target.value);
	};
	const orgIDSetter = (event: React.ChangeEvent<any>) => {
		setOrgID(event.target.value);
	};

	return (
		<div>
			{!mobileWidth && (
				<Button auto color="gradient" ghost shadow onPress={handler}>
					Settings
				</Button>
			)}

			{mobileWidth && (
				<div
					onClick={handler}
					style={{
						width: "25px",
						height: "25px",
					}}
				>
					<Cog6ToothIcon />
				</div>
			)}

			<Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
				<Modal.Header>
					<Text id="modal-title" size={18}>
						<Text b size={18}>
							Settings
						</Text>
					</Text>
				</Modal.Header>

				<Modal.Body>
					<Input
						clearable
						bordered
						fullWidth
						aria-label="insert api key"
						color="primary"
						size="lg"
						placeholder="API Key"
						initialValue={apiKeyText}
						onChange={apiKeySetter}
					/>
					<Input
						clearable
						bordered
						fullWidth
						aria-label="insert organization id"
						color="primary"
						size="lg"
						placeholder="Organization ID"
						initialValue={orgID}
						onChange={orgIDSetter}
					/>
				</Modal.Body>

				<Modal.Footer>
					<Button auto flat color="error" onPress={closeHandler}>
						Close
					</Button>
					<Button auto onPress={updateDocument}>
						Add
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}
