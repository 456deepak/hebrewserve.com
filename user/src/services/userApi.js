import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { getLocalStorageToken } from "../utils/commonFunction";
import CommonMessage from "../utils/commonMessage";

const baseURL = process.env.REACT_APP_APIURL;

const errorMessagesDisplayed = new Set();

const confg = async (data) => {
    try {
        const response = await axios({
            method: data?.method,
            url: baseURL + data?.url,
            headers: data?.headers,
            params: data?.params,
            data: data?.data,
        });
        return response;
    } catch (error) {
        // Check if the error message has already been displayed
        const errorMessage =
            error?.response?.data?.message || "something went wrong";
        if (!errorMessagesDisplayed.has(errorMessage)) {
            errorMessagesDisplayed.add(errorMessage);
            if (
                error?.response?.data?.message &&
                (typeof error?.response?.data?.message == "object" ||
                    Array.isArray(error?.response?.data?.message))
            ) {
                for (const property in error?.response?.data?.message) {
                    toast.error(`${error?.response?.data?.message[property]}`);
                }
            } else {
                toast.error(errorMessage);
            }
        }

        if (error?.response?.status === 401) {
            setTimeout(() => {
                localStorage.removeItem("Login");
                window?.location?.replace("/");
            }, 2000);
        } else {
            errorMessagesDisplayed.clear();
        }

        throw new Error(error);
    }
};

export const LoginApi = async (data) => {
    let config = {
        method: "post",
        url: "user/login",
        data: data,
    };

    return await confg(config);
};

export const RegisterApi = async (data) => {
    let config = {
        method: "post",
        url: "user/signup",
        data: data,
    };
    return await confg(config);
};

export const checkReferID = async (data) => {
    let config = {
        method: "post",
        url: "user/checkReferID",
        data
    }
    return await confg(config);
}