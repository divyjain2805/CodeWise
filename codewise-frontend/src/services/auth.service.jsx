import api from "../api/axios";


export async function registeruser(userdata) {
    const response = await api.post("/auth/register", userdata);
    return response.data;
}

export async function loginuser(userdata) {
    const response = await api.post("/auth/login", userdata);
    return response.data;
}

export async function logoutuser() {
    const response = await api.post("/auth/logout");
    return response.data;
}

export async function getprofile() {
    const response = await api.get("/auth/profile");
    return response.data;
}