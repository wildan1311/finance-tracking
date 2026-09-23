import { Form, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import FormsCreate from "./transactions/forms-create";
import { useActionState, useEffect } from "react";
import Toaster from "@/lib/Toaster";

interface props {
  handleCreate: (_prevState: any, formData: FormData) => Promise<any>;
  refreshTable: () => Promise<any>;
}

const CreateTransactionDialog = ({ handleCreate, refreshTable }: props) => {
  const [state, formAction, pending] = useActionState(handleCreate, {
    success: false,
    message: "",
    errors: {},
    values: {},
  });

  useEffect(() => {
    if (state.message) {
      Toaster.showFromResponse(state);
      refreshTable();
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="default">
            <Plus data-icon="inline-start" />
            Create
          </Button>
        }
      />
      <DialogContent className="md:min-w-xl">
        <form action={formAction} name="submited">
          <DialogHeader>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-300">
                Tambah Transaksi
              </h3>
              <p className="text-xs text-zinc-400">
                Tambahkan Pengeluaran atau Pemasukan
              </p>
            </div>
          </DialogHeader>
          <FormsCreate state={state} />
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
