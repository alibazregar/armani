import { Request, Response } from "express";
import Address from "./../../models/address"; // Import the Address model

// Controller for creating a new address
export const createAddress = async (req: Request, res: Response) => {
  try {
    const { receiverName, receiverPhone, postcode, state, town, mainAddress } =
      req.body;
    const address = new Address({
      //@ts-ignore
      userId: req?.user?._id,
      receiverName,
      receiverPhone,
      postcode,
      state,
      town,
      mainAddress,
    });
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: err });
  }
};

// Controller for modifying an existing address
export const modifyAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { receiverName, receiverPhone, postcode, state, town, mainAddress } =
      req.body;
    const address = await Address.findByIdAndUpdate(
      id,
      { receiverName, receiverPhone, postcode, state, town, mainAddress },
      { new: true }
    );
    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to modify address" });
  }
};

// Controller for deleting an existing address
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    //@ts-ignore
    await Address.findOneAndDelete({ _id: id, userId: req.user._id });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete address" });
  }
};

// Controller for fetching all addresses belonging to the logged-in user
export const getUserAddresses = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const addresses = await Address.find({ userId: req.user._id });
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};
