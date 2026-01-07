import type { AuthResponse } from "@/models/user"

export async function registerEmail(
  fullName: string,
  email: string,
  password: string
): Promise<{ ok: boolean; status: number; body?: unknown }> {
  const url = `${process.env.NEXT_PUBLIC_API_URL as string}register/email`
  const res = await fetch(url, {
    cache: "no-store",
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fullName, email, password })
  })

  let body: unknown
  try {
    body = await res.json()
  } catch {
    body = undefined
  }

  return {
    ok: res.status === 200 || res.status === 201,
    status: res.status,
    body
  }
}

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
