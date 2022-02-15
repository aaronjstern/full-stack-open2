const Header = ({ name }) => {
    return <h2>{name}</h2>;
  };
  
  const Total = ({ parts }) => {
    const sum = parts.reduce((sum, { exercises }) => sum + exercises, 0);
    return <p>Number of exercises {sum}</p>;
  };
  
  const Part = ({ part }) => {
    return (
      <p>
        {part.name} {part.exercises}
      </p>
    );
  };
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map((part) => (
          <Part key={part.id} part={part}></Part>
        ))}
      </div>
    );
  };
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    );
  };
  
  
  export default Course;
  