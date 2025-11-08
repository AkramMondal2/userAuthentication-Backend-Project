import todoSchema from "../models/todoSchema.js";

export const addTodo = async (req, res) => {
  try {
    const { title } = req.body;

    const exiesting = await todoSchema.findOne({
      title: title,
      userId: req.userId,
    });

    if (exiesting) {
      return res.status(400).json({
        sucess: false,
        message: "title already exiext",
      });
    }

    const data = await todoSchema.create({
      title,
      userId: req.userId,
    });

    if (!data) {
      return res.status(500).json({
        sucess: false,
        message: "Todo not created",
      });
    }

    return res.status(201).json({
      sucess: true,
      message: "Todo created sucessfuly",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Could not access",
    });
  }
};

export const getAllTodo = async (req, res) => {
  try {
    const data = await todoSchema.find({ userId: req.userId });
    if (!data) {
      return res.status(500).json({
        sucess: false,
        message: "Todo not fetchrd",
      });
    }
    return res.status(200).json({
      sucess: true,
      message: "Todo fetched sucessfuly",
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      sucess: false,
      message: "Todo not fetched ",
    });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const data = await todoSchema.findByIdAndDelete({
      userId: req.userId,
      _id: todoId,
    });
    if (!data) {
      return res.status(404).json({
        sucess: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      sucess: true,
      message: "Todo deleted sucessfuly",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Todo not deleted",
    });
  }
  y;
};

export const updateTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todoId = req.params.id;

    const data = await todoSchema.findOne({
      _id: todoId,
      userId: req.userId,
    });

    if (!data) {
      return res.status(404).json({
        sucess: false,
        message: "Todo not found",
      });
    }

    const exiesting = await todoSchema.findOne({
      title: title,
      userId: req.userId,
    });

    if (exiesting) {
      return res.status(400).json({
        sucess: false,
        message: "Title already exiest",
      });
    }

    (data.title = title), (data.updatedAt = Date.now());
    await data.save();

    return res.status(200).json({
      sucess: true,
      message: "Todo updated sucessfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Could not update",
    });
  }
};
