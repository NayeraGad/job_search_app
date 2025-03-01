import { chatModel } from "../../../DB/models/chat.Model.js";
import { AppError, asyncHandler } from "../../../utilities/index.js";

export const getChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const chat = await chatModel
    .findOne({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    })
    .populate([
      { path: "senderId", select: "email" },
      { path: "receiverId", select: "email" },
      { path: "messages.senderId", select: "email" },
    ]);

  if (!chat) return next(new AppError("Chat not found", 404));

  return res.status(200).json({ message: "done", chat });
});
