import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof verifySchema>) => {
    try {
      // API call logic
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: values.code,
      });
      if (response.data && response.data?.success) {
        toast({
          variant: "default",
          title: "Success",
          description: response.data.message,
        });
        router.replace("sign-in");
      } else {
        toast({
          variant: "destructive",
          title: "Opps: Error Occured",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log("Error while verification", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return <div>VerifyAccount</div>;
};

export default VerifyAccount;
