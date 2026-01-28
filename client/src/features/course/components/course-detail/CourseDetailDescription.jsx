const CourseDetailDescription = ({ description }) => {
  if (!description) return null

  return (
    <div className="mb-10 animate-fade-in">
      <p
        className="
        text-lg md:text-xl text-gray-800 leading-relaxed font-inter
        first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]
      "
      >
        {description}
      </p>
    </div>
  )
}

export default CourseDetailDescription
