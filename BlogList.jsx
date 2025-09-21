import React, { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { blog_data, blogCategories } from '../assets/assets'
import BlogCard from './BlogCard'

const BlogList = () => {
  const [active, setActive] = useState('All')

  const items = useMemo(() => {
    const norm = (s = '') => s.toLowerCase().trim()
    return (blog_data || []).filter(b => active === 'All' || norm(b.category) === norm(active))
  }, [active])

  return (
    <motion.div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 mt-10">
      {/* category pills */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {blogCategories.map((cat, i) => (
          <motion.button
            key={cat}
            onClick={() => setActive(cat)}
            className={`relative px-5 py-2 rounded-full text-sm sm:text-base font-medium transition-colors duration-300
              ${active === cat ? 'text-[#0E3A2D]' : 'text-white hover:text-[#F5B8A1]'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28, delay: 0.02 * i }}
          >
            {active === cat && (
              <motion.span
                layoutId="pill"
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(90deg,#D2A065 0%,#c89154 100%)' }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        ))}
      </div>

      {/* card grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((blog) => (
          <BlogCard key={blog._id || blog.title} blog={blog} compact />
        ))}
      </div>
    </motion.div>
  )
}

export default BlogList
