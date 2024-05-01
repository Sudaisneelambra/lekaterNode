const users = require("../models/userlogin");
const emails = require("../utils/emails");

const addUser = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;
    console.log(req.body);
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.json({
        success: false,
        message: "user already exists",
      });
    } else {
      const password =
        username.substring(0, 4).toUpperCase() +
        phoneNumber.toString().substring(0, 4);

      emails(email, `ADMIN VERIFICATION EMAIL`, username, password)
        .then((res) => {
          console.log("suucessfully mail sended");
          // const newUser = new users({
          //     username,
          //     email,
          //     phoneNumber,
          //     password
          // })
          // await newUser.save()
        })
        .catch((err) => {
          console.log(`errr ${err}`);
          res.status(400).json({
            message: "email send failed",
          });
        });

      res.json({
        success: true,
        message: "user added successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "User Adding Failed",
    });
  }
};

const showUser = async (req, res) => {
  try {
    const userList = await users.find();
    if (userList.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", userList });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const blockAndUnblockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blockStatus = !user.blockStatus;
    await user.save();
    return res
      .status(200)
      .json({ message: "Block status updated successfully", user });
  } catch (error) {
    console.error("Error updating block status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addUser, showUser, blockAndUnblockUser };
