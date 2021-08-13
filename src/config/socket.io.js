import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

console.log("process.env.REACT_APP_SOCKET_URL: ", process.env.REACT_APP_SOCKET_URL);
console.log("process.env.REACT_APP_API_URL: ", process.env.REACT_APP_API_URL);

// const socket = io(process.env.REACT_APP_API_URL, {
//   withCredentials: true,
//   transportOptions: {
//     polling: {
//       extraHeaders: {
//         "my-custom-header": "reimon"
//       }
//     }
//   }
// });

export default socket;