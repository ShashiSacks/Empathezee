const MedicineOrder = require("../models/MedicineOrder");


// book medicine order
const orderMedicine = async (req, res) => {
    try {
        const { medicineName, quantity, address, paymentMethod } = req.body;

        if (!medicineName || !quantity || !address || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required to place an order." });
        }

        const qty = parseInt(quantity, 10);
        const totalAmount = qty * 150;

        const order = await MedicineOrder.create({
            patient: req.user._id,
            medicineName: medicineName.trim(),
            quantity: qty,
            address: address.trim(),
            paymentMethod,
            totalAmount,
            status: "PENDING"
        });

        if (paymentMethod === "card") {
            const stripeSecret = process.env.STRIPE_SECRET_KEY;
            if (!stripeSecret) {
                return res.status(400).json({ message: "Stripe keys are not configured on the server." });
            }
            const stripe = require("stripe")(stripeSecret);
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount * 100,
                currency: "inr",
                metadata: {
                    orderId: order._id.toString(),
                    patientId: req.user._id.toString(),
                    medicineName: medicineName
                }
            });

            order.paymentIntentId = paymentIntent.id;
            await order.save();

            return res.status(201).json({
                requiresAction: true,
                clientSecret: paymentIntent.client_secret,
                orderId: order._id,
                order
            });
        }

        res.status(201).json({
            requiresAction: false,
            message: "Medicine order booked successfully",
            orderId: order._id,
            order
        });

    } catch (error) {
        console.error("Order Medicine Error:", error);
        res.status(500).json({ message: "Server error booking medicine order" });
    }
};


// confirm payment status
const confirmPayment = async (req, res) => {
    try {
        const { orderId, paymentIntentId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required." });
        }

        const order = await MedicineOrder.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        order.paymentStatus = "PAID";
        order.status = "PROCESSING";
        if (paymentIntentId) {
            order.paymentIntentId = paymentIntentId;
        }
        await order.save();

        res.status(200).json({
            message: "Payment status confirmed",
            order
        });
    } catch (error) {
        console.error("Confirm Payment Error:", error);
        res.status(500).json({ message: "Server error confirming payment" });
    }
};

module.exports = {
    orderMedicine,
    confirmPayment
};