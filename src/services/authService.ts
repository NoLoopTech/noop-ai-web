import type { AuthResponse } from "@/models/user"

export async function emailVerify(
  code: string
): Promise<AuthResponse | undefined> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL as string
    }register/email/verify-link?code=${code}`,
    {
      cache: "no-store",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  )
  if (res.status === 200 || res.status === 201) {
    // auth success
    return await res.json()
  } else {
    return undefined
  }
}

export async function authenticate(
  email: string,
  password: string
): Promise<AuthResponse | undefined> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}auth/login`,
    {
      cache: "no-store",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  )
  if (res.status === 200 || res.status === 201) {
    // auth success
    return await res.json()
  } else {
    return undefined
  }
}

export async function gauth(
  email: string,
  credential: string
): Promise<AuthResponse | undefined> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL as string}auth/gauth`,
    {
      cache: "no-store",
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idToken: credential
      })
    }
  )
  if (res.status === 200 || res.status === 201) {
    // auth success
    return await res.json()
  } else {
    return undefined
  }
}
