import ActivityCard from './ActivityCard'
import {activities} from '../data/activities'


const ActivityGrid = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mx-10'>
        {activities.map((item) => (
            <ActivityCard key={item.id} path={item.path} title={item.title} image={item.image} description={item.description}/>
        ))}
    </div>
  )
}

export default ActivityGrid