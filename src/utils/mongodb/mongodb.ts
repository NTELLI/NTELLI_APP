import * as Realm from "realm-web";
import { ObjectID } from "bson";

const {
	BSON: { ObjectId },
} = Realm;

export const getUserData = async (app: Realm.App) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const userData = await mongo?.db("chatgpt").collection("user").findOne({ user_id: app.currentUser?.id });
	return userData;
};

export const updateApiKey = async (app: Realm.App, key: string) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("user");
	const result = await collection?.updateOne(
		{ user_id: { $eq: app.currentUser?.id } },
		{ $set: { openai_apiKey: key } }
	);
	return result;
};

export const updateOrgID = async (app: Realm.App, orgID: string) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("user");
	let result;
	try {
		result = await collection?.updateOne(
			{ user_id: { $eq: app.currentUser?.id } },
			{ $set: { openai_organization_id: orgID } }
		);
	} catch (error) {
		console.log(error);
	}
	return result;
};

export const updateApiKeyAndOrgID = async (app: Realm.App, key: string, orgID: string) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("user");
	let result;
	try {
		result = await collection?.updateOne(
			{ user_id: { $eq: app.currentUser?.id } },
			{ $set: { openai_apiKey: key, openai_organization_id: orgID } }
		);
	} catch (error) {
		console.log(error);
	}
	return result;
};

export const createChat = async (
	app: Realm.App,
	message: string,
	res: string | string[],
	title: string | undefined,
	urlID: string | ObjectID
) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");
	let result;
	try {
		result = await collection?.updateOne(
			{ url_id: { $eq: urlID }, user_id: { $eq: app.currentUser?.id } },
			{
				$set: {
					title: title,
					url_id: new ObjectId(urlID),
					messages: [
						{ role: "user", message: message },
						{ role: "assistant", message: res },
					],
				},
			},
			{ upsert: true }
		);
	} catch (e) {
		console.log(e);
	}
	return result;
};

export const addMessagesToChat = async (app: Realm.App, message: string, res: string | string[], urlID: ObjectID) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");
	let result;
	try {
		result = await collection?.updateOne(
			{ url_id: { $eq: urlID }, user_id: { $eq: app.currentUser?.id } },

			{
				$push: {
					messages: {
						$each: [
							{ role: "user", message: message },
							{ role: "assistant", message: res },
						],
					},
				},
			}
		);
	} catch (e) {
		console.log(e);
	}
	return result;
};

export const getAllChats = async (app: Realm.App) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");
	let result;
	try {
		result = await collection?.find({ user_id: app.currentUser?.id });
	} catch (error) {
		console.log(error);
	}
	return result;
};
export const getAllChatTitles = async (app: Realm.App) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");
	let result;
	try {
		const fields = collection?.find(
			{ user_id: app.currentUser?.id },
			{ projection: { title: 1, _id: 1, url_id: 1 } } // retrieve both title and _id, url fields
		);
		if (fields) {
			result = await fields;
		}
	} catch (error) {
		console.log(error);
	}
	return result?.map(chat => ({ _id: chat._id, title: chat.title, url_id: chat.url_id })) || []; // extract fields from each chat object
};

export const getChat = async (app: Realm.App, paramName: string | ObjectID | undefined) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");

	let result;
	try {
		result = await collection?.find({ user_id: app.currentUser?.id, url_id: new ObjectId(`${paramName}`) });
	} catch (error) {
		console.log(error);
	}
	return result;
};

export const deleteChat = async (app: Realm.App, id: ObjectID) => {
	console.log("id", id);
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");
	let result;
	try {
		result = await collection?.deleteOne({ user_id: app.currentUser?.id, _id: id });
		console.log(result);
	} catch (error) {
		console.log(error);
	}
	return result;
};

export const updateTitle = async (app: Realm.App, currentTitle: string, newTitle: string) => {
	const mongo = app.currentUser?.mongoClient("mongodb-atlas");
	const collection = mongo?.db("chatgpt").collection("chat");
	let result;
	try {
		result = await collection?.updateOne(
			{ user_id: { $eq: app.currentUser?.id }, title: { $eq: currentTitle } },
			{ $set: { title: newTitle } }
		);
	} catch (error) {
		console.log(error);
	}
	return result;
};
