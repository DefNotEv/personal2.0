import type { CSSProperties } from 'react'
import type { Character } from '../data/characters.ts'
import { findPost, posts } from '../data/posts.ts'
import type { Post } from '../data/posts.ts'
import { Cabinet } from './Cabinet.tsx'

function VersionTag({ post }: { post: Post }) {
  return (
    <span className="post-tag" style={{ '--accent': post.version.accent } as CSSProperties}>
      <span aria-hidden="true">{post.version.icon}</span> {post.version.short}
    </span>
  )
}

function PostMeta({ post }: { post: Post }) {
  return (
    <p className="post-meta">
      {post.dateLabel ? <time dateTime={post.date}>{post.dateLabel}</time> : null}
      <span>{post.minutes} min read</span>
      <VersionTag post={post} />
    </p>
  )
}

export function BlogPage({ character, post: slug }: { character: Character; post?: string }) {
  if (slug) {
    const post = findPost(slug)
    return (
      <Cabinet character={post?.version ?? character}>
        <header className="topbar">
          <a className="eyebrow back-link" href="#/blog">
            ← All posts
          </a>
        </header>
        {post ? (
          <article className="page post">
            <h1 className="page__title">{post.title}</h1>
            <PostMeta post={post} />
            <div className="post__body" dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>
        ) : (
          <section className="page">
            <h1 className="page__title">Post not found</h1>
            <p className="page__lede">That post doesn't exist (yet).</p>
          </section>
        )}
      </Cabinet>
    )
  }

  return (
    <Cabinet character={character}>
      <header className="topbar">
        <p className="eyebrow">Blog</p>
      </header>
      <section className="page">
        <h1 className="page__title">Blog</h1>
        <p className="page__lede">I yap a lot, get to know me a bit better!</p>
        {posts.length ? (
          <ul className="post-list">
            {posts.map((entry) => (
              <li
                key={entry.slug}
                className="post-card"
                style={{ '--accent': entry.version.accent } as CSSProperties}
              >
                <a href={`#/blog/${entry.slug}`}>
                  <h2 className="post-card__title">{entry.title}</h2>
                  <PostMeta post={entry} />
                  <p className="post-card__excerpt">{entry.excerpt}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="page__empty">
            <p className="eyebrow">No posts yet</p>
            <p>Check back soon.</p>
          </div>
        )}
      </section>
    </Cabinet>
  )
}
