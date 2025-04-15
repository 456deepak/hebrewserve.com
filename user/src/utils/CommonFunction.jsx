import React, { useState } from "react";
import CryptoJS from "crypto-js";
import moment from "moment/moment";

export const setLocalStorageToken = (key, data) => {
  localStorage.setItem(key, CryptoJS.AES.encrypt(data, key).toString());
};

export const getLocalStorageToken = (key) => {
  let local = localStorage.getItem(key);
  if (local) {
    let bytes = CryptoJS.AES.decrypt(local, key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } else {
    return false;
  }
};

export const AmountFormat = (x) => {
  return x.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const setPassword = (key, data) => {
  return key, CryptoJS.AES.encrypt(data, key).toString();
};

// export const setPassword = (password, key) => {
//     // Convert the key to a WordArray (16 bytes)
//     const keyBytes = CryptoJS.enc.Utf8.parse(key);

//     // Generate a random IV (Initialization Vector)
//     const iv = CryptoJS.lib.WordArray.random(16);

//     // Encrypt the password with AES using the key and IV
//     const encrypted = CryptoJS.AES.encrypt(password, keyBytes, {
//       iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7,
//     });

//     // Combine the IV and ciphertext as a single string
//     const encryptedData = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);

//     return encryptedData;
//   };

// Usage
//   const password = 'user_password'; // The user's password
//   const encryptionKey = 'YOUR_ENCRYPTION_KEY'; // Replace with your encryption key
//   const encryptedPassword = encryptPassword(password, encryptionKey);
//   console.log('Encrypted Password:', encryptedPassword);

export const getPassword = (key, local) => {
  // let local = localStorage.getItem(key);
  if (local) {
    let bytes = CryptoJS.AES.decrypt(local, key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } else {
    return false;
  }
};

// TimeZone change from utc to local
export const timeZoneUtcToLocal = (date) => {
  if (date) {
    //   setDateFlag(true);

    // Convert UTC date to local time zone
    const utcDate = moment.utc(date);
    const localDate = utcDate.local();

    // Format the local date in "DD/MM/YYYY" format
    const formattedDate = localDate.format("MM/DD/YYYY");

    // Update state with the formatted local date
    // setNewDate(formattedDate);
    return formattedDate;

    // Update the 'dob' field in props with the formatted local date
    // props.setFieldValue('dob', formattedDate);
  } else {
    // setDateFlag(false);
    return false;
  }
};

export const checkValidData = (data) => {
  return data || "N/A"
}

export const capitalizeFirstLetterOfEachWord = (str) => {
  // Split the string into words
  let words = str.split(' ');

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words back together
  return words.join(' ');
}
