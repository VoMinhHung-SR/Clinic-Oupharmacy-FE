
const Clock = () => {
    return (
        <>
            <div className="clock">
                <div className="hours">
                    <div className="hh" id="hh"></div>
                </div>
                <div className="mins">
                    <div className="mm" id="mm"></div>
                </div>
                <div className="seconds">
                    <div className="ss" id="ss"></div>
                </div>
            </div>
        </>
    )
}

export default Clock;