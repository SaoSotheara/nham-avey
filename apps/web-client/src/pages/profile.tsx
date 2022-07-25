import { yupResolver } from "@hookform/resolvers/yup"
import clsx from "clsx"
import { NextSeo } from "next-seo"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import {
  useFirebaseAuthState,
  useMeQuery,
  useUpdateMeMutation,
} from "@nham-avey/common"
import useRedirectOnUnauthed from "src/hooks/use-redirect-on-unauthed"
import firebaseServices from "src/services/firebase-services"

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

interface FormProps {
  email?: string
  password?: string
}

const { auth } = firebaseServices

const UpdateProfilePage = () => {
  useRedirectOnUnauthed(auth, "/login")
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isValid },
    setValue,
  } = useForm<FormProps>({
    mode: "onChange",
    resolver: yupResolver(schema),
  })

  const { user } = useFirebaseAuthState(auth)
  const { data: userData } = useMeQuery({
    onCompleted: data => {
      setValue("email", data.me.email)
    },
    ssr: false,
    skip: !user,
  })

  console.log({ userData })
  const [updateMe, { loading }] = useUpdateMeMutation({})

  const onSubmit = () => {
    // const { email, password } = getValues()
    // updateMe({
    //   variables: {
    //     input: {
    //       email,
    //       firstName,
    //       lastName,
    //       photoURL,
    //     },
    //   },
    // })
  }
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <NextSeo title="Edit Profile | Nham Avey" />
      <h4 className="text-2x1 mb-3 font-semibold">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 mb-5 grid w-full max-w-screen-sm gap-3"
      >
        <input
          {...register("email")}
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          {...register("password")}
          className="input"
          type="password"
          placeholder="Password"
        />

        <button
          className={clsx("btn btn-primary", {
            loading,
          })}
          disabled={!isValid}
        >
          Save Profile
        </button>
      </form>
    </div>
  )
}

export default UpdateProfilePage