import { atom } from "recoil";
import { ObjectID } from "bson";

export const inputMessageState = atom<string>({
	key: "inputMessageState",
	default: "",
});

export const streamedTextState = atom<string>({
	key: "streamedTextState",
	default: "",
});

export const transcriptionTextState = atom<string>({
	key: "transcriptionTextState",
	default: "",
});

export const generatedImageState = atom<string>({
	key: "generatedImageState",
	default: "",
});

export const isDisabledState = atom<boolean>({
	key: "isDisabledState",
	default: false,
});

export const isSidebarVisibleState = atom<boolean>({
	key: "isSidebarVisibleState",
	default: true,
});

export const loadingState = atom<boolean>({
	key: "loadingState",
	default: false,
});

export const isDoneState = atom<boolean>({
	key: "isDoneState",
	default: false,
});

export const copiedState = atom<boolean>({
	key: "copiedState",
	default: false,
});

export const audioFileState = atom<File | null>({
	key: "audioFileState",
	default: null,
});

export const excelFileState = atom<any>({
	key: "excelFileState",
	default: null,
});

export const urlPathnameState = atom<ObjectID>({
	key: "urlPathnameState",
	default: undefined,
});

export const finalTextState = atom<string>({
	key: "finalTextState",
	default: "",
});

export const updateState = atom<number>({
	key: "updateState",
	default: 0,
});
