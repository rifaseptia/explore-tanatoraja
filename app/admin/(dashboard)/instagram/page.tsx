export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink, Instagram } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import InstagramPost from '@/models/InstagramPost';
import DeleteInstagramPostButton from '@/components/admin/delete-instagram-post-button';

async function getInstagramPosts() {
    await dbConnect();
    return InstagramPost.find().sort({ order: 1, createdAt: -1 }).lean();
}

export default async function InstagramPostsAdminPage() {
    const posts = await getInstagramPosts();

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-heading font-bold text-2xl text-indigo-900">Instagram Feed</h1>
                    <p className="text-neutral-500 mt-1">
                        Manage Instagram posts to display on homepage (embedded)
                    </p>
                </div>
                <Link
                    href="/admin/instagram/new"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Post
                </Link>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 rounded-lg">
                <h3 className="text-sm font-medium text-pink-700 mb-2">How to add Instagram posts:</h3>
                <ol className="text-xs text-pink-600 list-decimal list-inside space-y-1">
                    <li>Open Instagram and find the post you want to display</li>
                    <li>Tap "..." and select "Copy link"</li>
                    <li>Paste the URL in the form below</li>
                    <li>The post will be embedded on the homepage</li>
                </ol>
            </div>

            {/* Posts Grid */}
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post: any) => (
                        <div
                            key={post._id}
                            className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
                        >
                            {/* Preview Area - shows embedded post */}
                            <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <Instagram className="w-10 h-10 text-pink-400 mx-auto mb-2" />
                                    <p className="text-xs text-neutral-500">Embedded Instagram Post</p>
                                </div>
                                {/* Inactive Badge */}
                                {!post.isActive && (
                                    <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4 border-t border-neutral-100">
                                <p className="text-xs text-neutral-400 truncate mb-3" title={post.postUrl}>
                                    {post.postUrl?.replace('https://www.instagram.com/', '').substring(0, 40)}...
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-500">Order: #{post.order || 0}</span>

                                    <div className="flex items-center gap-2">
                                        {post.postUrl && (
                                            <a
                                                href={post.postUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="View on Instagram"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <Link
                                            href={`/admin/instagram/${post._id}/edit`}
                                            className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <DeleteInstagramPostButton
                                            id={post._id.toString()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
                    <Instagram className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500 mb-4">No Instagram posts yet</p>
                    <Link
                        href="/admin/instagram/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Your First Post
                    </Link>
                </div>
            )}

            {/* Tips */}
            {posts.length > 0 && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <p className="text-sm text-amber-800">
                        <strong>Tips:</strong> Maximum 6 posts will be embedded on the homepage.
                        Posts are displayed as embedded Instagram posts (like on destination pages).
                    </p>
                </div>
            )}
        </div>
    );
}
