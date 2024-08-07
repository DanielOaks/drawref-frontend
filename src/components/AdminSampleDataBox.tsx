import { useState } from "react";

import { useGetSampleDataQuery } from "../app/apiSlice";
import SessionCheckboxGroup from "./SessionCheckboxGroup";
import TheLoadingModal from "./TheLoadingModal";
import { useAppSelector } from "../app/hooks";
import { Tag } from "../types/drawref";

interface UploadData {
  [key: string]: string[];
}

interface Props {
  onSubmit(data: any): void;
  error?: string;
}

function AdminSampleDataBox({ onSubmit, error }: Props) {
  const user = useAppSelector((state) => state.userProfile);
  const [uploadData, setUploadData] = useState<UploadData>({});
  const [agreeToConditions, setAgreeToConditions] = useState(false);

  const { data: sampleData, isLoading: isSampleDataLoading } = useGetSampleDataQuery({ token: user.token });
  const checkboxDefaultData: Tag[] =
    (sampleData && [
      {
        id: "categories",
        name: "Categories",
        values: sampleData.categories.map((cat) => cat.name),
      },
      {
        id: "images",
        name: "Images",
        values: sampleData.images.map((img) => img.author),
      },
    ]) ||
    [];

  // const otherTextErrors = [addImageError, uploadImageError].filter((e) => e && e.data).map((e) => e.data.error);
  // const errorToShow = [error, otherTextErrors].join(" ").trim();
  const errorToShow = "";

  const conditions: string[] =
    (sampleData &&
      uploadData &&
      uploadData.images &&
      (uploadData.images.length > 0
        ? ["You will keep the author name and link attached to each sample image."]
        : []
      ).concat(
        sampleData.images
          .map((img) => {
            if (uploadData.images.indexOf(img.author) !== -1) {
              return img.requirement;
            }
            return "";
          })
          .filter((name: string) => !!name),
      )) ||
    [];

  return (
    <>
      {isSampleDataLoading && <TheLoadingModal />}
      <form
        className="box-border flex w-[28em] max-w-full flex-col gap-3 border-[5px] border-primary-700 bg-primary-900 px-4 py-6"
        onSubmit={async (e) => {
          e.preventDefault();

          const data = {
            categories: uploadData.categories,
            images: uploadData.images,
          };

          // console.log(conditions, conditions && conditions.length, agreeToConditions);

          if (conditions && conditions.length > 0 && agreeToConditions === false) {
            console.log("Can't submit, conditions aren't agreed to");
            return;
          }

          onSubmit(data);
        }}
      >
        {sampleData && (
          <>
            <h2 className="text-xl font-medium">Import</h2>
            <div className="mx-auto grid grid-cols-4 gap-x-7 gap-y-4">
              <SessionCheckboxGroup tags={checkboxDefaultData} onChange={(data) => setUploadData(data)} />
            </div>

            {conditions && conditions.length > 0 && (
              <>
                <h2 className="mt-6 text-xl font-medium">Conditions</h2>
                <ul className="mx-5 -mt-2.5 list-disc text-left">
                  {conditions.map((name) => (
                    <li key={name} className="my-2">
                      {name}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={agreeToConditions}
                    onChange={() => setAgreeToConditions(!agreeToConditions)}
                  />
                  <label htmlFor="checkbox">I agree to the conditions above.</label>
                </div>
              </>
            )}
          </>
        )}

        {errorToShow && (
          <span className="mx-auto -mb-5 mt-3 w-auto bg-red-600 px-3 py-1 text-sm">Error: {errorToShow}</span>
        )}

        <button
          type="submit"
          className="mx-auto mt-6 rounded bg-secondary-500 px-5 py-1.5 text-sm text-white shadow"
          disabled={false}
        >
          Save
        </button>
      </form>
    </>
  );
}

export default AdminSampleDataBox;
