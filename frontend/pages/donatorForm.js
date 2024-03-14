import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { RadioButton } from 'react-native-paper';
import ProvinceSelector from '../components/provinceSelector'
import AsyncStorage from '@react-native-async-storage/async-storage';

const DonatorForm = () => {
    const [isCompany, setIsCompany] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [province, setProvince] = useState("");
    const [postal, setPostal] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const getUsers = async () => {
        try {
            const userJSON = await AsyncStorage.getItem('users');
            return userJSON != null ? JSON.parse(userJSON) : {};
        } catch (e) {
            console.log(e);
        }
    }

    const storeUsers = async (users) => {
        try {
            const userJSON = JSON.stringify(users);
            await AsyncStorage.setItem('users', userJSON);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmit = async () => {
        // check if any fields are left empty
        if (name == "" || address == "" || city == "" || province == ""
            || postal == "" || email == "") {
            setError("Please Fill in All Fields");
            return;
        }

        // check if address starts with number
        if (!address.match(/^\d+(\s\w+){2,}/)) {
            setError("Please Enter Address as number street name");
            return;
        }

        // check for valid postal codes
        if (postal.length != 6) {
            setError("Please Enter a valid Postal Code");
            return;
        }
        // check that all odd characters are letters
        if (!(postal[0].match(/[a-z]/i) && postal[2].match(/[a-z]/i)
            && postal[4].match(/[a-z]/i))) {
            setError("Please Enter a valid Postal Code");
            return;
        }
        // check that all even characters are numbers
        if (!(postal[1].match(/^\d$/) && postal[3].match(/^\d$/)
            && postal[5].match(/^\d$/))) {
            setError("Please Enter a valid Postal Code");
            return;
        }

        // check if email is of valid format
        if (!email.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            setError("Please Enter a valid Email Address");
            return;
        }

        setError("");

        const user = {
            "company": isCompany,
            "address": address,
            "city": city,
            "province": province,
            "postal": postal,
            "email": email
        }
        const users = await getUsers();
        users[name] = user;

        storeUsers(users);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Donate Now</Text>
            <Text style={styles.amount_title}>Add User</Text>
            <View style={styles.redLine} />
            <View style={styles.radioContainer}>
                <RadioButton
                    value="Individual"
                    status={isCompany ? 'unchecked' : 'checked'}
                    color="red"
                    onPress={() => setIsCompany(false)}
                />
                <Text style={styles.radioText}>Individual</Text>
                <RadioButton
                    value="Corporation"
                    status={isCompany ? 'checked' : 'unchecked'}
                    color="red"
                    onPress={() => setIsCompany(true)}
                />
                <Text style={styles.radioText}>Corporation</Text>
            </View>
            {isCompany ?
                <TextInput
                    style={styles.input}
                    placeholder="Corporation Name"
                    value={name}
                    autoCapitalize="words"
                    onChangeText={setName}
                /> :
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    autoCapitalize="words"
                    onChangeText={setName}
                />}

            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                autoCapitalize="words"
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                autoCapitalize="words"
                onChangeText={setCity}
            />
            <View style={styles.row}>
                <ProvinceSelector province={province} setProvince={setProvince} />
                <TextInput
                    style={[styles.input, styles.flexHalf]}
                    placeholder="Postal Code"
                    value={postal}
                    autoCapitalize="characters"
                    onChangeText={setPostal}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitText}>Add User</Text>
            </TouchableOpacity>
            <Text style={styles.errorText}>{error}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 20,
    },
    amount_title: {
        fontSize: 17,
        color: "#000000",
        margin: 10, // Add a little space from the top and left edges
    },
    redLine: {
        width: "20%", // Or specific length you prefer
        height: 3, // Thin line
        backgroundColor: "red", // Line color
        borderRadius: 15, // Makes edges round, adjust as needed
        top: -10,
        left: 10,
    },
    title: {
        top: 10,
        left: "center", // Align to the left of the container
        fontSize: 30,
        color: "#000000",
        margin: 10, // Add a little space from the top and left edges
        alignSelf: 'center',
    },
    radioContainer: {
        flexDirection: "row",
        marginBottom: 20,
        gap: 5,
    },
    radioText: {
        textAlign: "center",
        marginTop: 7,
        marginRight: 25
    },
    input: {
        marginBottom: 20,
        paddingHorizontal: 10,
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexHalf: {
        width: "48%",
    },
    submitButton: {
        backgroundColor: "red",
        borderRadius: 5,
        marginTop: 20,
    },
    submitText: {
        color: "white",
        padding: 10,
        textAlign: "center",
        fontWeight: "bold",
    },
    subtext: {
        color: "gray",
        marginTop: -20,
    },
    invis: {
        color: "white",
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
});

export default DonatorForm;