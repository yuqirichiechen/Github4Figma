import { Mic } from 'lucide-react'
import Placeholder from '../Placeholder'

export default function ChangesView() {
  return (
    <Placeholder icon={Mic} title="Intent Note" sprint="Sprint 1 →">
      Designers attach a voice note explaining the intent behind a change. Screens
      and the record → playback → send → AI-summary flow land in the next sprints.
    </Placeholder>
  )
}
