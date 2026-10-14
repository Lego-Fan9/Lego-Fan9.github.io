import { useUpdateFreqCtx } from "../../ts/update-freq/context";

import { Card, CardRow } from "./page";

import EventFrequencyChart from "./grapher";

export default function GraphLoader() {
    const ctx = useUpdateFreqCtx()

    return (
        <>
            {
                ctx.versionNames.map(vn => (
                    <Card key={vn}>
                        <CardRow>
                            <EventFrequencyChart events={ctx.versions[vn]} type={vn} />
                        </CardRow>
                    </Card>
                ))

            }
        </>
    )
}