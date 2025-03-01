import { chatModel, companyModel } from "../../../DB/models/index.js";
import { authSocket } from "../../../middleware/index.js";
import { connectionUser } from "../../../utilities/index.js";

export const startChat = async (socket) => {
  const { user, statusCode } = await authSocket({ socket });

  if (statusCode !== 200) {
    return socket.emit("error", statusCode);
  }

   const company = await companyModel.findOne({
     $or: [{ ownerId: user._id }, { HRs: { $in: [user._id] } }],
   });

  if (!company) {
    return socket.emit("error", "Unauthorized");
  }

  connectionUser.set(user._id.toString(), socket.id);

  // Company' HR room
  socket.join(company._id.toString());

  return "done";
};

export const sendMessage = async (socket) => {
  socket.on("sendMessage", async (data) => {
    const { user, statusCode } = await authSocket({ socket });
    const { receiverId, message } = data;

    if (statusCode !== 200) {
      return socket.emit("error", statusCode);
    }

    if (!receiverId || !message) {
      return socket.emit("error", "receiverId and message are required");
    }

    let chat = await chatModel.findOne({
      $or: [
        { senderId: user._id, receiverId },
        { senderId: receiverId, receiverId: user._id },
      ],
    });

    if (!chat) {
      const isAuthorized = await companyModel.findOne({
        $or: [{ ownerId: user._id }, { HRs: { $in: [user._id] } }],
      });

      if (!isAuthorized) {
        return socket.emit(
          "error",
          "Only HR or company owner can start a chat"
        );
      }

      chat = await chatModel.create({
        senderId: user._id,
        receiverId,
        messages: [{ message, senderId: user._id }],
      });

      chat = await chatModel
        .findById(chat._id)
        .populate([
          { path: "senderId" },
          { path: "messages.senderId" },
          { path: "receiverId" },
        ]);
    } else {
      chat = await chatModel
        .findByIdAndUpdate(
          chat._id,
          { $push: { messages: { message, senderId: user._id } } },
          { new: true }
        )
        .populate([
          { path: "senderId" },
          { path: "messages.senderId" },
          { path: "receiverId" },
        ]);
    }

    socket.emit("successMessage", { message, chat });

    socket
      .to(connectionUser.get(receiverId.toString()))
      .emit("receiveMessage", { message });
  });
};
