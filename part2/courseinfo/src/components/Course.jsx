const Header = ({ name }) => <h1>{name}</h1>

const Content = ({ parts }) => parts.map(part => <Part key={part.id} part={part} />)
const Part = ({ part }) => (
    <p>
        {part.name} {part.exercises}
    </p>
)

const Total = (props) => <p><b>Number of exercises {props.total}</b></p>

const Course = ({ course }) => {
    const total = course.parts.reduce((s, p) => s + p.exercises, 0)
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total total={total} />
        </div>
    )
}

export default Course
