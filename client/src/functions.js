import axios from 'axios';

const userUrl = 'http://localhost:5000/docs/user';

// Get all users
export const getAllUsers = async () => {
    return axios.get(userUrl)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Get current users' information
export const getUserInformation = async (userEmail) => {
    return axios.get(`${userUrl}/getuserinfo?email=${userEmail}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Signup
export const signup = async (formData) => {
    return axios.post(`${userUrl}/signup`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
}

// Login 
export const loginUser = async (formData) => {
    return axios.post(`${userUrl}/signin`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
}

// Edit user information
export const editProfileInformation = async (formData) => {
    return axios.patch(`${userUrl}/editprofile`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Edit user password
export const editUserPassword = async (formData) => {
    return axios.patch(`${userUrl}/changepassword`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Upload a file
export const uploadFile = async (formData) => {
    return axios.patch(`${userUrl}/uploadfile`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

export const sendFile = async (formData) => {
    return axios.patch(`${userUrl}/sendfile`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
}

// Get all files from a user
export const getFiles = async (email) => {
    return axios.get(`${userUrl}/getfiles?email=${email}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

export const saveFileChanges = async (formData) => {
    return axios.patch(`${userUrl}/savefilechanges`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Delete a file
export const deleteFile = async (formData) => {
    return axios.delete(`${userUrl}/deletefile`, { data: formData })
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};