import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../../api/api";
import { useAuth } from "../../hooks/useStore";
import { toast } from "sonner";
import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reveal, setReveal] = useState(false);
  const { setAccessToken, checkAuth } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.state?.from || "/";
  const togglePassword = () => {
    setReveal((prev) => !prev);
  };

  const onFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await login(formData);
      setAccessToken(res.data.accessToken);
      toast.success(`Welcome ${res.data.firstName}`);
      navigate(redirect);
      checkAuth();
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[80%] md:max-w-[30%] mx-auto mt-[3rem] md:mt-0">
      <div>
        <NavLink to="/" className="font-bold">
          <h1 className="text-center text-3xl">DUMMY STORE</h1>
        </NavLink>
        <h1 className="mt-6 font-bold text-2xl text-center">Sign in</h1>
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! {error}.</span>
          </div>
        )}
        <form className="mt-12" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="w-full md:w-[250px] h-[48px] border-2 pl-3"
              placeholder="johndoe"
              id="username"
              name="username"
              {...register("username", { required: true })}
              defaultValue="emilys"
            />
            {errors.username && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="Password">Password</label>
            <div className="relative">
              <input
                type={reveal ? "text" : "password"}
                className="w-full md:w-[250px] h-[48px] border-2 pl-3"
                placeholder="enter your password"
                id="password"
                name="password"
                {...register("password", { required: true })}
                defaultValue="emilyspass"
              />
              <button className="absolute inset-y-0 right-2 border-0 font-semibold text-sm" onClick={togglePassword} type="button">
                {reveal ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-500 h-[48px] w-full md:w-[250px] text-slate-50 font-bold"
            disabled={isSubmitting}
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
