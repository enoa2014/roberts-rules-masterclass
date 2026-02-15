import { PageShell } from "@/components/page-shell";
import Link from "next/link";
import Image from "next/image";
import { promises as fs } from "fs";
import path from "path";

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  tags: string[];
};

async function getBooks(): Promise<Book[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "reading-legacy",
    "data",
    "books.json"
  );
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data?.books) ? data.books : [];
  } catch {
    return [];
  }
}

export default async function ReadingPage() {
  const books = await getBooks();

  return (
    <>
      <PageShell
        title="阅读探究"
        description="在故事中播种思考，在互动中收获感悟"
      />

      <section className="py-12 md:py-16">
        <div className="container max-w-6xl">
          {/* Section Header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 uppercase mb-3">
              <span className="h-px w-6 bg-blue-300" />
              互动书架
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              全部藏书
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl">
              每本书都配备了互动阅读、人物关系图、情境问答等丰富模块，让阅读不止于文字。
            </p>
          </div>

          {/* Book Grid */}
          {books.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <span className="text-4xl mb-4 block">📚</span>
              <p className="text-gray-400 font-medium">书架正在整理中</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          <div className="gradient-primary rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <span className="text-4xl mb-4 block">📖</span>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                开启你的阅读之旅
              </h2>
              <p className="text-blue-100 text-base max-w-md mx-auto mb-6 leading-relaxed">
                选择一本书，开始互动式阅读体验。深入故事情节，探索人物关系，挑战思维情境。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  const coverSrc = `/reading-legacy/${book.cover}`;

  return (
    <Link
      href={`/reading/${book.id}`}
      className="group block rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden">
        <Image
          src={coverSrc}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3">{book.author}</p>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {book.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
