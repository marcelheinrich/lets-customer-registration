import { CreateCustomerParams, ListCustomersParams, UpdateCustomerParams } from "../interfaces/customer.interface";

export function normalizeCreate(params: CreateCustomerParams) {
  const { fullName, birthDate, addresses, contacts, document } = params;

  if (typeof fullName !== "string" || fullName.trim() === "") {
    throw new Error("`fullName` is required and should be a non-empty string.");
  }

  const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!birthDatePattern.test(birthDate)) {
    throw new Error(
      "`birthDate` should be a valid date in the format YYYY-MM-DD."
    );
  }

  if (!Array.isArray(addresses) || addresses.length === 0) {
    throw new Error("`addresses` should be a non-empty array.");
  }

  addresses.forEach((address) => {
    if (typeof address.street !== "string" || address.street.trim() === "") {
      throw new Error("Each `address` should have a valid `street`.");
    }
    if (typeof address.number !== "string" || address.number.trim() === "") {
      throw new Error("Each `address` should have a valid `number`.");
    }
    if (
      typeof address.neighborhood !== "string" ||
      address.neighborhood.trim() === ""
    ) {
      throw new Error("Each `address` should have a valid `neighborhood`.");
    }
    if (typeof address.city !== "string" || address.city.trim() === "") {
      throw new Error("Each `address` should have a valid `city`.");
    }
    if (typeof address.state !== "string" || address.state.trim() === "") {
      throw new Error("Each `address` should have a valid `state`.");
    }
    if (
      typeof address.postalCode !== "string" ||
      address.postalCode.trim() === ""
    ) {
      throw new Error("Each `address` should have a valid `postalCode`.");
    }
  });

  if (!Array.isArray(contacts) || contacts.length === 0) {
    throw new Error("`contacts` should be a non-empty array.");
  }

  let mainContactFound = false;

  contacts.forEach((contact) => {
    if (typeof contact.phone !== "string" || contact.phone.trim() === "") {
      throw new Error("Each `contact` should have a valid `phone`.");
    }
    if (typeof contact.email !== "string" || !contact.email.includes("@")) {
      throw new Error("Each `contact` should have a valid `email`.");
    }
    if (typeof contact.isMain !== "boolean") {
      throw new Error("Each `contact` should have `isMain` as a boolean.");
    }

    if (contact.isMain) {
      mainContactFound = true;
    }
  });

  if (!mainContactFound) {
    throw new Error("At least one contact must be the primary.");
  }

  if (document && typeof document !== "string") {
    throw new Error("`document` should be a string.");
  }

  if (document) {
    const documentPattern = /^\d+$/;
    if (!documentPattern.test(document)) {
      throw new Error("`document` should only contain numbers.");
    }

    if (document.length !== 11 && document.length !== 14) {
      throw new Error(
        "`document` should have 11 digits (for CPF) or 14 digits (for CNPJ)."
      );
    }
  }
}


export function normalizeList(params: ListCustomersParams) {
  const { search, fullName, status, addresses, ids } = params;

  if (search && typeof search !== "string") {
    throw new Error("`search` should be a string.");
  }

  if (fullName && typeof fullName !== "string") {
    throw new Error("`fullName` should be a string.");
  }

  if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
    throw new Error("`status` should be either 'ACTIVE' or 'INACTIVE'.");
  }

  if (addresses && !Array.isArray(addresses)) {
    throw new Error("`addresses` should be an array.");
  }

  if (ids && (Array.isArray(ids) && ids.some((id) => typeof id !== "string"))) {
    throw new Error("Each item in `ids` should be a string.");
  }
}

export function normalizeUpdate(params: UpdateCustomerParams) {
  const { status, addresses, contacts } = params;

  if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
    throw new Error("`status` should be either 'ACTIVE' or 'INACTIVE'.");
  }

  if (addresses && !Array.isArray(addresses)) {
    throw new Error("`addresses` should be an array.");
  }

  if (contacts && !Array.isArray(contacts)) {
    throw new Error("`contacts` should be an array.");
  }
}


