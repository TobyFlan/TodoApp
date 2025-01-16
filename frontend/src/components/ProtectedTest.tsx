import axios from "axios";

const ProtectedButton = () => {
    const handleClick = async () => {
        const token = localStorage.getItem("token");

        console.log(token);

        try {
            const response = await axios.get("http://localhost:5182/jwt/test", {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            });
            alert(response.data);
        } catch {
            alert("Unauthorized");
        }
    };

    return (
        <button onClick={handleClick}>
            Test Protected Endpoint
        </button>
    );
};

export default ProtectedButton;
