import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    try {
        // first check that the user exist in the database or not
        const { fullname, email, password } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        //  if not exist in the database then save the data in the database
        const hashPassword = await bcryptjs.hash(password, 10);
        const createdUser = new User({
            fullname: fullname,
            email: email,
            password: hashPassword,
            // fullname,
            // email,
            // password,
        });
        await createdUser.save();

        // send the respone that user created successfully
        res.status(201).json({
            message: "User created successfully"
        })
    }
    catch (error) {
        console.log("Error:" + error.message)
        // if the user is not successfully created the show the error that there is internal server error
        res.status(500).json({ message: "Internal server error" })
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find that is email in already in database or not
        const user = await User.findOne({ email });

        // compare the password (password(filled by user), user.password(stored in database))
        const isMatch = await bcryptjs.compare(password, user.password);

        // if user or password not found
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        } else {
            // if user and password found
            res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};