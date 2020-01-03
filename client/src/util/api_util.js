import axios from "axios";

export const getLogs = () => {
  return axios.get("/api/logs")
}

export const getLog = (songNum) => {
  return axios.get(`/api/logs/${songNum}`).then(res => res.data[0])
}

export const postLog = (log) => {
  return axios.post(`/api/logs`, {
    songName: log.songName,
    songNumber: log.songNumber,
    col1: log.col1,
    col2: log.col2,
    col3: log.col3,
    col4: log.col4
  })
}