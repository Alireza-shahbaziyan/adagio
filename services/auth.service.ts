import { User } from "@/types/auth";

export async function verifyOtpApi(data: {
  phone: string;
  code: string;
}) {
  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        phone: data.phone,
        code: data.code,
      }),
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        responseData?.detail || "Verification failed",
      );
    }

    return responseData;
  } catch (error) {
    console.error("verifyOtpApi error:", error);
    throw error;
  }
}

export async function loginApi({
  phone,
}: {
  phone: string;
}) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.detail || "Login failed",
    );
  }

  return data;
}

export async function getMe(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as User;
  } catch (error) {
    console.error("getMe error:", error);
    return null;
  }
}

// import { User } from "@/types/auth";

// export async function verifyOtpApi(data: { phone: string; code: string }) {

//   try {
//     const res = await fetch("/api/auth/verify-otp", {
//       method: "POST",
//       headers: {
//          "Content-Type": "application/json",   
//        },
//       credentials: "include",
//       body: JSON.stringify({
//         phone: data.phone,
//         code: data.code,
//       }),
//     });

//     if (!res.ok) throw new Error("Verification failed");

//     return res.json();
//   } catch (error) {
//     console.error(error);
//     throw new Error("Verification failed");
//   }
// }

// export async function loginApi({ phone }: { phone: string }) {


//   const res = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ phone }),
//   });

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error(data?.detail || "Verification failed");
//   }

//   return data;
// }


// export async function getMe(): Promise<User | null> {
//   try {
//     // Backend requires CSRF cookie before /me
//     // const csrfResponse = await fetch("/api/auth/csrf", {
//     //   method: "GET",
//     //   credentials: "include",
//     //   cache: "no-store",
//     // });

//     // if (!csrfResponse.ok) {
//     //   return null;
//     // }

//     const response = await fetch("/api/auth/me", {
//       method: "GET",
//       headers:{
//           "Content-Type": "application/json",
//           credentials: "include",
//       },
//       credentials: "include",
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       return null;
//     }

//     return (await response.json()) as User;
//   } catch (error) {
//     console.error("getMe error:", error);
//     return null;
//   }
// }