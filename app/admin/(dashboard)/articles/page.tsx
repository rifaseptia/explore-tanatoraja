import Link from 'next/link';
import { Plus, Pencil, MoreHorizontal, Search, Filter, FileText } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import Article, { IArticle } from '@/models/Article';
import DeleteArticleButton from '@/components/admin/delete-article-button';

async function getArticles() {
    await dbConnect();
    const articles = await Article.find().sort({ publishedAt: -1 }).lean();

    // Explicitly cast _id to string to avoid serialization issues
    return JSON.parse(JSON.stringify(articles));
}

function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export default async function AdminArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Articles</h1>
                    <p className="text-neutral-500 mt-1">
                        Manage travel tips and news ({articles.length} total)
                    </p>
                </div>
                <Link
                    href="/admin/articles/create"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Write Article
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-neutral-100 p-4 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Articles Table */}
            <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Article
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Published
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-16 text-center">
                                    <div className="max-w-sm mx-auto">
                                        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-neutral-300" />
                                        </div>
                                        <h3 className="font-medium text-indigo-900 mb-1">No articles yet</h3>
                                        <p className="text-neutral-500 text-sm mb-4">
                                            Share your first story or tip to engage visitors.
                                        </p>
                                        <Link
                                            href="/admin/articles/create"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Write Article
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            articles.map((article: any) => (
                                <tr key={article._id} className="hover:bg-neutral-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                                                {article.featuredImage ? (
                                                    <img
                                                        src={article.featuredImage}
                                                        alt={article.title.en || article.title.id}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-indigo-900 line-clamp-1">{article.title.en || article.title.id}</p>
                                                <p className="text-sm text-neutral-400">{article.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-neutral-600">
                                            {formatDate(article.publishedAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium capitalize">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {article.isPublished ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/articles/${article._id}/edit`}
                                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <DeleteArticleButton id={article._id} title={article.title.en || article.title.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
