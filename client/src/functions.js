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

// Get a list of all user names on the system
export const getUserNames = async (email) => {
    return axios.get(`${userUrl}/getusernames?email=${email}`)
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

// Get a list of senders
export const getSenders = async (email) => {
  return axios.get(`${userUrl}/getsenders?email=${email}`)
  .then((res) => {
      return res.data;
  })
  .catch((err) => err.message);
}

// Get a list of file extensions
export const getFileExtensions = async (email) => {
  return axios.get(`${userUrl}/getfileextensions?email=${email}`)
  .then((res) => {
    return res.data;
  })
  .catch((err) => err.message);
};

// Signup
export const signup = async (formData) => {
    return axios.post(`${userUrl}/signup`, formData)
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
}

// Login 
export const loginUser = async (formData) => {
    return axios.post(`${userUrl}/signin`, formData)
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
}

// Edit user information
export const editProfileInformation = async (formData) => {
    return axios.patch(`${userUrl}/editprofile`, formData)
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
};

// Edit user password
export const editUserPassword = async (formData) => {
    return axios.patch(`${userUrl}/changepassword`, formData)
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
};

// Upload a file
export const uploadFile = async (formData) => {
    return axios.patch(`${userUrl}/uploadfile`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Send a file to another user
export const sendFiles = async (formData) => {
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

// Get files that are in a users inbox
export const getInboxFiles = async (email) => {
    return axios.get(`${userUrl}/getinbox?email=${email}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Get files that are in a users recycling bin
export const getRecycleBinFiles = async (email) => {
    return axios.get(`${userUrl}/getrecycle?email=${email}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Accept file from inbox
export const acceptReceivedFile = async (formData) => {
    return axios.patch(`${userUrl}/acceptfile`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Reject a file that has been sent to a user
export const rejectReceivedFile = async (formData) => {
    return axios.delete(`${userUrl}/rejectfile`, { data: formData })
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
}

// Restore deleted file
export const restoreDeletedFile = async (formData) => {
    return axios.patch(`${userUrl}/restorefile`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Save changes made to a file
export const saveFileChanges = async (formData) => {
    return axios.patch(`${userUrl}/savefilechanges`, formData)
    .then((res) => {
        return res.data;
    })
    .catch((err) => err.message);
};

// Change the name of a file
export const changeFileName = async (formData) => {
    return axios.patch(`${userUrl}/editfilename`, formData)
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