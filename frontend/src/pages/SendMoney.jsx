import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // State to track loading
    const [success, setSuccess] = useState(false); // State to show success notification

    const handleTransfer = async () => {
        setLoading(true); // Start loading
        setError(null); // Clear any previous errors

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token is missing");
            }

            const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount: parseFloat(amount)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Transfer successful:", response.data);
            setSuccess(true); // Show success notification
            // Optionally, clear the amount or redirect user after success
            setAmount(0); // Reset the amount field
        } catch (err) {
            console.error("Error during transfer:", err);
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    onChange={(e) => setAmount(e.target.value)}
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    placeholder="Enter amount"
                                    value={amount}
                                    disabled={loading} // Disable input while loading
                                />
                            </div>
                            <button
                                onClick={handleTransfer}
                                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? "Sending..." : "Initiate Transfer"}
                            </button>
                            {error && <div className="text-red-500 mt-2">Error: {error}</div>}
                            {success && <div className="text-green-500 mt-2">Money sent successfully !</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
