import {Hero} from '../components/Hero'
import {Dashboard} from '../components/Dashboard'
import {Flywheel} from '../components/Flywheel'
import {MarketplacePreview} from '../components/MarketplacePreview'
import { RecentActivity } from '../components/RecentActivity/RecentActivity'

function Home(){
 return <>
 <Hero/>
 <Dashboard/>
 <RecentActivity/>
 <Flywheel/>
 <MarketplacePreview/>
 </>
}
export default Home
