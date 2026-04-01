"use client";
import { useState } from "react";
import { register } from "../action/auth";
function Page() {
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
  });
  const [info, setInfo] = useState<any>();
  const [status, setStatus] = useState<any>(false);

  const simpanData = async (form: FormData) => {
    try {
      const response = await register(form);
      setForm({
        name: "",
        email: "",
        password: "",
      });
      setInfo(response?.error);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <span className="text-5xl">Register page</span>
      <div>
        <div className="flex justify-center items-center">
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <span className="font-medium">info: </span>
            {info}
          </div>
        </div>
        <form action={simpanData} className="max-w-sm mx-auto">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              onChange={(e: any) => setForm({ ...form, name: e.target.value })}
              className=" text-black bg-gray-50 border border-gray-300
                    rounded-lg py-2 w-full"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="text"
              name="email"
              onChange={(e: any) => setForm({ ...form, email: e.target.value })}
              className="text-black bg-gray-50 border border-gray-300
                    rounded-lg py-2 w-full"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="text"
              name="password"
              onChange={(e: any) =>
                setForm({ ...form, password: e.target.value })
              }
              className="text-black bg-gray-50 border border-gray-300
                    rounded-lg py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 w-full hover:bg-red-700  text-white p-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
