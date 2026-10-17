import prisma from "@/app/lib/prisma";
import SearchForm from "./search-form";
import DeleteButton from "./delete-button";

type StudentsPageProps = {
  searchParams: Promise<{
    search?: string;
    major?: string;
    status?: string;
  }>;
};

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const params = await searchParams;

  const search = params.search ?? "";
  const major = params.major ?? "";
  const status = params.status ?? "";

  const students = await prisma.student.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                {
                  studentCode: {
                    contains: search,
                  },
                },
                {
                  name: {
                    contains: search,
                  },
                },
              ],
            }
          : {},

        major
          ? {
              major: major,
            }
          : {},

        status
          ? {
              status: status === "active",
            }
          : {},
      ],
    },

    orderBy: {
      id: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>

        <p className="mt-2 text-gray-600">จัดการข้อมูลนักศึกษา</p>
      </div>

      <SearchForm search={search} major={major} status={status} />
      <div className="flex justify-between">
        <div className="mb-4 text-sm text-gray-600">
          พบข้อมูล {students.length} รายการ
        </div>
        <div>
          <a
            href={`/students/create`}
            className="inline-block rounded bg-blue-600 my-5 px-6 py-2.5 text-sm font-medium text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            เพิ่มนักศึกษา
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">รหัส</th>

              <th className="px-4 py-3 text-left">ชื่อ</th>

              <th className="px-4 py-3 text-left">Email</th>

              <th className="px-4 py-3 text-left">สาขา</th>

              <th className="px-4 py-3 text-left">ชั้นปี</th>

              <th className="px-4 py-3 text-left">สถานะ</th>

              <th className="px-4 py-3">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3">{student.studentCode}</td>

                <td className="px-4 py-3">{student.name}</td>

                <td className="px-4 py-3">{student.email ?? "-"}</td>

                <td className="px-4 py-3">{student.major}</td>

                <td className="px-4 py-3">{student.year}</td>

                <td className="px-4 py-3">
                  {student.status ? "กำลังศึกษา" : "พ้นสภาพ"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a
                      href={`/students/edit/${student.id}`}
                      className="rounded-md bg-yellow-500 px-3 py-1.5 text-sm text-white"
                    >
                      แก้ไข
                    </a>

                    <DeleteButton id={student.id} />
                  </div>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  ไม่พบข้อมูลนักศึกษา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}